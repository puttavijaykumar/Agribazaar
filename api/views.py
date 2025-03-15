from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import  status
from .serializers import *
import os
from django.conf import settings
from django.http import HttpResponse
import uuid

import random as rd
from .email_sender import Email
from .database import Database
from .hash_password import PasswordHasher

class GenerateRegistrationOtpAPIView(APIView):

    def post(self, request):

        serializer = GenerateRegistrationOtpSerializer(data = request.data)

        if(serializer.is_valid()):
            
            try:
                database = Database()
                email = Email()

                database.create_tables()

                if(database.email_exists(request.data["email"])):
                    database.close()
                    return Response({"message": "Email already exists!"}, status=status.HTTP_400_BAD_REQUEST)
                
                otp = rd.randint(100000, 999999)
                database.save_registration_otp(request.data["email"], otp)
                email.send_email(
                    subject = "Registration OTP",
                    body = "Your Registration OTP is " + str(otp),
                    to_email = request.data["email"]
                )

                email.close()
                database.close()

                return Response({"message": "OTP sent successfully!"}, status=status.HTTP_201_CREATED)
            
            except Exception as e:
                print(f"Exception -> {e}")
                return Response({"message": "Failed to generate OTP."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegistrationAPIView(APIView):

    def post(self, request):
        serializer = RegistrationSerializer(data = request.data)

        if(serializer.is_valid()):

            database = Database()
            database.create_tables()

            if(database.user_exists(request.data["username"])):
                database.close()
                return Response({"message": "User already exists!"}, status=status.HTTP_400_BAD_REQUEST)
            
            if(database.email_exists(request.data["email"])):
                database.close()
                return Response({"message": "Email already exists!"}, status=status.HTTP_400_BAD_REQUEST)
            
            if(not database.valid_registration_otp(request.data["email"], int(request.data["otp"]))):
                database.close()
                return Response({"message": "Incorrect OTP!"}, status=status.HTTP_400_BAD_REQUEST)

            hashed_password = PasswordHasher.hash_password_bcrypt(request.data["password"])

            database.clear_otp(request.data["email"], "registration")
            database.register(request.data["username"], hashed_password, request.data["email"], request.data["is_student"])
            database.close()
            return Response({"message": "Registered successfully!"}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LoginAPIView(APIView):

    def post(self, request):
        
        serializer = LoginSerializer(data = request.data)

        if(serializer.is_valid()):

            database = Database()
            database.create_tables()
            
            if(database.authenticate(request.data["username"], request.data["password"])):
                is_student = database.is_student(request.data["username"])
                session_id = str(uuid.uuid4())
                database.save_session_id(request.data["username"], session_id)
                database.close()
                return Response({"message": "Logged in successfully!", 
                                 "username" : request.data["username"], 
                                 "is_student" : is_student,
                                 "session_id" : session_id}, 
                                 status=status.HTTP_200_OK)
            else:
                database.close()
                return Response({"message": "Invalid credentials!"}, status=status.HTTP_400_BAD_REQUEST)
            
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GenerateResetPasswordAPIView(APIView):

    def post(self, request):
        
        serializers = GenerateResetPasswordOtpSerializer(data = request.data)

        if(serializers.is_valid()):
            database = Database()
            email = Email()

            database.create_tables()

            if(database.user_email_combination_exists(request.data["username"], request.data["email"])):
                
                otp = rd.randint(100000, 999999)
                database.save_reset_password_otp(request.data["email"], otp)
                email.send_email(
                    subject = "Reset Password OTP",
                    body = "Your Reset Password OTP is " + str(otp),
                    to_email = request.data["email"]
                )

                email.close()
                database.close()
            
            else:
                database.close()
                return Response({"message": "Invalid Details"}, status=status.HTTP_400_BAD_REQUEST)

            return Response({"message": "OTP sent successfully!"}, status=status.HTTP_201_CREATED)
        
        else:
            return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)

class ResetPasswordAPIView(APIView):

    def post(self, request):
        
        serializers = ResetPasswordSerializer(data = request.data)

        if(serializers.is_valid()):
            database = Database()
            database.create_tables()

            if(not database.valid_reset_password_otp(request.data["email"], int(request.data["otp"]))):
                database.close()
                return Response({"message": "Incorrect OTP!"}, status=status.HTTP_400_BAD_REQUEST)
            elif(not database.user_email_combination_exists(request.data["username"], request.data["email"])):
                database.close()
                return Response({"message": "Invalid Details!"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                database.clear_otp(request.data["email"], "reset_password")
                database.reset_password(request.data["username"], PasswordHasher.hash_password_bcrypt(request.data["new_password"]))
                database.close()
                return Response({"message": "Password reset successfully!"}, status=status.HTTP_200_OK)
        
        else:
            return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutAPIView(APIView):

    def post(self, request):
        
        serializers = LogoutSerializer(data = request.data)

        if(serializers.is_valid()):
            database = Database()
            database.create_tables()
            
            if(database.valid_session_id(request.data["username"], request.data["session_id"])):
                database.clear_session_id(request.data["username"])
                database.close()
                return Response({"message": "Logged out successfully!"}, status=status.HTTP_200_OK)
            else:
                database.close()
                return Response({"message": "Invalid session id!"}, status=status.HTTP_400_BAD_REQUEST)
        
        else:
            return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)

class FileUploadAPIView(APIView):

    def post(self, request):

        serializers = FileUploadSerializer(data = request.data)

        if(serializers.is_valid()):
            
            uploaded_file = request.FILES["file"]

            save_path = os.path.join(settings.UPLOADED_DOCS, request.data["username"], uploaded_file.name)
            os.makedirs(os.path.dirname(save_path), exist_ok = True)

            if(os.path.exists(save_path)):
                return Response({"message": "File already exists!"}, status=status.HTTP_400_BAD_REQUEST)

            with open(save_path, 'wb+') as destination:
                for chunk in uploaded_file.chunks():
                    destination.write(chunk)

            return Response({"message": "File uploaded successfully!", "file_name": uploaded_file.name}, status = status.HTTP_201_CREATED)

        else:
            return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)
        
class FileDownloadAPIView(APIView):

    def post(self, request):

        serializers = FileDownloadSerializer(data = request.data)

        if(serializers.is_valid()):
            file_path = os.path.join(settings.UPLOADED_DOCS, request.data["username"], request.data["file_name"])

            if(os.path.exists(file_path)):
                with open(file_path, "rb") as file:
                    file_data = file.read() # Read file data

                return HttpResponse(file_data, status = status.HTTP_200_OK) 
                   
            else:
                return Response({"message": "File not found!"}, status = status.HTTP_404_NOT_FOUND)
        
        else:
            return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)
        
class FileDeleteAPIView(APIView):

    def post(self, request):
      
        serializers = FileDownloadSerializer(data = request.data)

        if(serializers.is_valid()):
            file_path = os.path.join(settings.UPLOADED_DOCS, request.data["username"], request.data["file_name"])

            if(os.path.exists(file_path)):
                os.remove(file_path)
                return Response({"message": "File deleted successfully!"}, status = status.HTTP_200_OK)
                   
            else:
                return Response({"message": "File not found!"}, status = status.HTTP_404_NOT_FOUND)
        
        else:
            return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)