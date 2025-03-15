from rest_framework import serializers
import os

class RegistrationSerializer(serializers.Serializer):
    
    username = serializers.CharField(max_length = 256)
    password = serializers.CharField(max_length = 64)
    email = serializers.CharField(max_length = 256)
    is_student = serializers.BooleanField()
    otp = serializers.IntegerField(min_value=100000, max_value=999999)

class GenerateRegistrationOtpSerializer(serializers.Serializer):

    email = serializers.CharField(max_length = 256)

class LoginSerializer(serializers.Serializer):

    username = serializers.CharField(max_length = 256)
    password = serializers.CharField(max_length = 64)

class GenerateResetPasswordOtpSerializer(serializers.Serializer):

    username = serializers.CharField(max_length = 256)
    email = serializers.CharField(max_length = 256)

class ResetPasswordSerializer(serializers.Serializer):

    username = serializers.CharField(max_length = 256)
    email = serializers.CharField(max_length = 256)
    otp = serializers.IntegerField(min_value=100000, max_value=999999)
    new_password = serializers.CharField(max_length = 64)

class LogoutSerializer(serializers.Serializer):
    
    username = serializers.CharField(max_length = 256)
    session_id = serializers.CharField()

class FileUploadSerializer(serializers.Serializer):

    username =  serializers.CharField(max_length = 256)
    file = serializers.FileField()

    def validate_file(self, value):
        """ Custom validation for file size and type """
        max_size = 10 * 1024 * 1024  # 10MB limit
        allowed_extensions = [".pdf", ".txt", ".docx", ".pptx"]
        ext = os.path.splitext(value.name)[1].lower()  # Extract file extension

        if (value.size > max_size):
            raise serializers.ValidationError("File size exceeds 10MB limit.")
        
        if (ext not in allowed_extensions):
            raise serializers.ValidationError("Invalid file extension. Only PDF, TXT, DOCX AND PPTX are allowed.")

        return value
    
class FileDownloadSerializer(serializers.Serializer):
    
    username = serializers.CharField(max_length = 256)
    file_name = serializers.CharField(max_length = 256)

class FileDeleteSerializer(serializers.Serializer):
    
    username = serializers.CharField(max_length = 256)
    file_name = serializers.CharField(max_length = 256)