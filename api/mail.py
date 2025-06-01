import os
import smtplib
from email.mime.application import MIMEApplication
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# Interview data
data = {
   "candidateName": "Rick Astley",
   "overallScore": 82,
   "summary": "Great technical proficiency and strong problem-solving skills. Improve on articulating design trade-offs and clarify edge-case handling.",
   "sections": [
      {
         "title": "Technical",
         "score": 85,
         "feedback": [
            "Answered most JavaScript and React questions confidently.",
            "Demonstrated solid understanding of asynchronous patterns.",
            "Could expand on advanced TypeScript utility types."
         ]
      },
      {
         "title": "System Design",
         "score": 78,
         "feedback": [
            "Identified major components correctly.",
            "Missed discussing database sharding implications.",
            "Gave thoughtful scalability considerations overall."
         ]
      },
      {
         "title": "Behavioral",
         "score": 80,
         "feedback": [
            "Showed ownership of past projects.",
            "Used STAR format effectively.",
            "Could provide more metrics when describing impact."
         ]
      }
   ]
}

# Build HTML email body
def build_html_body(data):
    html = f"""
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #4CAF50;">AI-Cruiter Interview Feedback</h2>
        <p><strong>Candidate:</strong> {data['candidateName']}</p>
        <p><strong>Overall Score:</strong> {data['overallScore']}/100</p>
        <p><strong>Summary:</strong> {data['summary']}</p>
        <h3>🔍 Section-wise Breakdown:</h3>
    """

    for section in data["sections"]:
        html += f"""
        <h4 style="margin-bottom: 5px;">🔸 {section['title']} <span style="color: #888;">(Score: {section['score']}/100)</span></h4>
        <ul>
        """
        for feedback in section["feedback"]:
            html += f"<li>{feedback}</li>"
        html += "</ul>"

    html += """
        <p>Best regards,<br><strong>AI-cruiter Team</strong></p>
      </body>
    </html>
    """
    return html

# Build email message
def message(subject="Interview Feedback", html_text="", img=None, attachment=None):
    msg = MIMEMultipart("alternative")
    msg['Subject'] = subject

    # Attach HTML body
    msg.attach(MIMEText(html_text, 'html'))

    if img is not None:
        if type(img) is not list:
            img = [img]
        for one_img in img:
            img_data = open(one_img, 'rb').read()
            msg.attach(MIMEImage(img_data, name=os.path.basename(one_img)))

    if attachment is not None:
        if type(attachment) is not list:
            attachment = [attachment]
        for one_attachment in attachment:
            with open(one_attachment, 'rb') as f:
                file = MIMEApplication(f.read(), name=os.path.basename(one_attachment))
            file['Content-Disposition'] = f'attachment; filename="{os.path.basename(one_attachment)}"'
            msg.attach(file)

    return msg

# Email setup
smtp = smtplib.SMTP('smtp.gmail.com', 587)
smtp.ehlo()
smtp.starttls()
email = os.environ.get('EMAIL_USER','')
password = os.environ.get('EMAIL_PASS','')
smtp.login(email, password)

# Generate HTML body and send
html_body = build_html_body(data)
msg = message(subject=f"AI-cruiter Interview Feedback: {data['candidateName']}", html_text=html_body)

to = ["arvindagarwal839@gmail.com"]
smtp.sendmail(from_addr="Aicruiter@gmail.com", to_addrs=to, msg=msg.as_string())
smtp.quit()
