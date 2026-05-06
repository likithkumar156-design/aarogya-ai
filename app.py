from flask import Flask, request, Response
from twilio.twiml.voice_response import VoiceResponse, Gather
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)

# Session storage
sessions = {}

def get_session(call_sid):
    if call_sid not in sessions:
        sessions[call_sid] = {
            "language": "hi",
            "symptoms": [],
            "duration": None
        }
    return sessions[call_sid]

# ─────────────────────────
# STEP 1 - Welcome Message
# ─────────────────────────
@app.route("/ivrs/welcome", methods=["GET","POST"])
def welcome():
    response = VoiceResponse()
    gather = Gather(
        num_digits=1,
        action="/ivrs/language",
        timeout=10
    )
    gather.say(
        "Aarogya AI mein aapka swagat hai. "
        "Hindi ke liye 1 dabayen. "
        "For English press 2.",
        voice="Polly.Aditi",
        language="hi-IN"
    )
    response.append(gather)
    response.redirect("/ivrs/welcome")
    return Response(str(response), mimetype="text/xml")

# ─────────────────────────
# STEP 2 - Language Choice
# ─────────────────────────
@app.route("/ivrs/language", methods=["POST"])
def language():
    digit = request.form.get("Digits", "1")
    call_sid = request.form.get("CallSid")
    session = get_session(call_sid)
    session["language"] = "hi" if digit == "1" else "en"

    response = VoiceResponse()
    gather = Gather(
        num_digits=1,
        action="/ivrs/symptom",
        timeout=10
    )

    if session["language"] == "hi":
        gather.say(
            "Apna mukhya lakshan chunen. "
            "Bukhaar ke liye 1. "
            "Khansi ke liye 2. "
            "Kamzori ke liye 3. "
            "Sar dard ke liye 4.",
            voice="Polly.Aditi",
            language="hi-IN"
        )
    else:
        gather.say(
            "Please select your main symptom. "
            "Press 1 for Fever. "
            "Press 2 for Cough. "
            "Press 3 for Weakness. "
            "Press 4 for Headache.",
            voice="Polly.Raveena",
            language="en-IN"
        )

    response.append(gather)
    return Response(str(response), mimetype="text/xml")

# ─────────────────────────
# STEP 3 - Symptom Input
# ─────────────────────────
@app.route("/ivrs/symptom", methods=["POST"])
def symptom():
    digit = request.form.get("Digits", "")
    call_sid = request.form.get("CallSid")
    session = get_session(call_sid)

    symptom_map = {
        "1": "fever",
        "2": "cough",
        "3": "weakness",
        "4": "headache"
    }
    if digit in symptom_map:
        session["symptoms"].append(symptom_map[digit])

    response = VoiceResponse()
    gather = Gather(
        num_digits=1,
        action="/ivrs/more",
        timeout=10
    )

    if session["language"] == "hi":
        gather.say(
            "Kya aapko aur koi takleef hai? "
            "Haan ke liye 1 dabayen. "
            "Nahi ke liye 2 dabayen.",
            voice="Polly.Aditi",
            language="hi-IN"
        )
    else:
        gather.say(
            "Do you have any other symptoms? "
            "Press 1 for Yes. "
            "Press 2 for No.",
            voice="Polly.Raveena",
            language="en-IN"
        )

    response.append(gather)
    return Response(str(response), mimetype="text/xml")

# ─────────────────────────
# STEP 4 - More Symptoms?
# ─────────────────────────
@app.route("/ivrs/more", methods=["POST"])
def more():
    digit = request.form.get("Digits", "2")
    call_sid = request.form.get("CallSid")
    session = get_session(call_sid)

    if digit == "1":
        # Ask for another symptom
        response = VoiceResponse()
        gather = Gather(
            num_digits=1,
            action="/ivrs/symptom",
            timeout=10
        )
        if session["language"] == "hi":
            gather.say(
                "Bukhaar ke liye 1. "
                "Khansi ke liye 2. "
                "Kamzori ke liye 3. "
                "Sar dard ke liye 4.",
                voice="Polly.Aditi",
                language="hi-IN"
            )
        else:
            gather.say(
                "Fever press 1. "
                "Cough press 2. "
                "Weakness press 3. "
                "Headache press 4.",
                voice="Polly.Raveena",
                language="en-IN"
            )
        response.append(gather)
        return Response(str(response), mimetype="text/xml")

    else:
        # Go to duration question
        response = VoiceResponse()
        gather = Gather(
            num_digits=1,
            action="/ivrs/duration",
            timeout=10
        )
        if session["language"] == "hi":
            gather.say(
                "Yeh takleef kitne samay se hai? "
                "3 din se kam ke liye 1. "
                "1 hafte ke liye 2. "
                "1 mahine se zyada ke liye 3.",
                voice="Polly.Aditi",
                language="hi-IN"
            )
        else:
            gather.say(
                "How long have you had these symptoms? "
                "Less than 3 days press 1. "
                "About 1 week press 2. "
                "More than 1 month press 3.",
                voice="Polly.Raveena",
                language="en-IN"
            )
        response.append(gather)
        return Response(str(response), mimetype="text/xml")

# ─────────────────────────
# STEP 5 - Duration Input
# ─────────────────────────
@app.route("/ivrs/duration", methods=["POST"])
def duration():
    digit = request.form.get("Digits", "1")
    call_sid = request.form.get("CallSid")
    session = get_session(call_sid)

    duration_map = {
        "1": "short",
        "2": "medium",
        "3": "long"
    }
    session["duration"] = duration_map.get(digit, "short")

    response = VoiceResponse()
    if session["language"] == "hi":
        response.say(
            "Aapki jaankari ka vishleshan kiya ja raha hai. "
            "Kripya pratiksha karen.",
            voice="Polly.Aditi",
            language="hi-IN"
        )
    else:
        response.say(
            "Analyzing your information. Please wait.",
            voice="Polly.Raveena",
            language="en-IN"
        )
    response.redirect("/ivrs/result")
    return Response(str(response), mimetype="text/xml")

# ─────────────────────────
# STEP 6 - Give Result
# ─────────────────────────
@app.route("/ivrs/result", methods=["POST"])
def result():
    call_sid = request.form.get("CallSid")
    session = get_session(call_sid)

    symptoms = session.get("symptoms", [])
    duration = session.get("duration", "short")

    # Simple risk calculation
    risk = "LOW"
    if len(symptoms) >= 2 and duration == "long":
        risk = "HIGH"
    elif len(symptoms) >= 2 or duration == "medium":
        risk = "MEDIUM"

    response = VoiceResponse()

    if session["language"] == "hi":
        if risk == "HIGH":
            msg = (
                "Aapke lakshan gambhir hain. "
                "Kripya aaj hi nearest PHC mein jayen. "
                "Aapke phone par SMS bheja ja raha hai. "
                "Dhanyavaad."
            )
        elif risk == "MEDIUM":
            msg = (
                "Aapko jald doctor se milna chahiye. "
                "Telemedicine appointment book ki ja rahi hai. "
                "Dhanyavaad."
            )
        else:
            msg = (
                "Abhi aapki sthiti theek lagti hai. "
                "Aaram karen aur paani peete rahen. "
                "Takleef badhne par dobara call karen. "
                "Dhanyavaad."
            )
        response.say(msg, voice="Polly.Aditi", language="hi-IN")

    else:
        if risk == "HIGH":
            msg = (
                "Your symptoms are serious. "
                "Please visit the nearest PHC today. "
                "An SMS is being sent to you. "
                "Thank you."
            )
        elif risk == "MEDIUM":
            msg = (
                "You should see a doctor soon. "
                "A telemedicine appointment is being booked. "
                "Thank you."
            )
        else:
            msg = (
                "Your condition seems stable right now. "
                "Please rest and stay hydrated. "
                "Call back if symptoms worsen. "
                "Thank you."
            )
        response.say(msg, voice="Polly.Raveena", language="en-IN")

    response.hangup()
    print(f"Call completed | Symptoms: {symptoms} | Risk: {risk}")
    return Response(str(response), mimetype="text/xml")


if __name__ == "__main__":
    print("=" * 40)
    print("Aarogya AI IVRS Server Running")
    print("URL: http://localhost:5000")
    print("=" * 40)
    app.run(debug=True, port=5000)
