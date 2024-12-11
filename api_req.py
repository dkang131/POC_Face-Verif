import requests

url = "http://127.0.0.1:5000/verify_faces"
files = {
    'image1': open('temp_image1.jpg', 'rb'),
    'image2': open('test5.jpg', 'rb'),
}
try:
    response = requests.post(url, files=files)
    print("Status Code:", response.status_code)
    print("Response Body:", response.json())
except Exception as e:
    print("Error:", e)