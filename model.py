from facenet_pytorch import MTCNN, InceptionResnetV1
from PIL import Image, ImageDraw

# Initialize MTCNN for face detection
mtcnn = MTCNN()

# Load pre-trained Inception ResNet model
resnet = InceptionResnetV1(pretrained='casia-webface').eval()

def face_verification(img1, img2):

    # Load two face images to be verified
    img1 = Image.open(img1)
    img2 = Image.open(img2)

    # Detect faces and extract embeddings
    faces1, _ = mtcnn.detect(img1)
    faces2, _ = mtcnn.detect(img2)

    aligned1 = mtcnn(img1)
    aligned2 = mtcnn(img2)

    if faces1 is not None and faces2 is not None:
        aligned1 = aligned1.unsqueeze(0)
        aligned2 = aligned2.unsqueeze(0)
        embeddings1 = resnet(aligned1).detach()
        embeddings2 = resnet(aligned2).detach()
    
        # Calculate the Euclidean distance between embeddings
        distance = (embeddings1 - embeddings2).norm().item()
        return distance < 1.0 #TRUE(same person)
    
    raise ValueError("Face(s) not detected in one or both images.")

face_verification('C:/Users/darre/Desktop/PORTO/mtcnn/test.jpg', 'C:/Users/darre/Desktop/PORTO/mtcnn/test4.jpg')