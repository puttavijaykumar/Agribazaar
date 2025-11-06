# accounts/views.py
from rest_framework.response import Response
from rest_framework import generics, status
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer
from .models import CustomUser
from rest_framework.views import APIView
from django.contrib.auth import get_user_model, login
from django.contrib.auth.hashers import make_password
from .serializers import GoogleAuthSerializer,RoleUpdateSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import CustomUser
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes


# User Registration View
class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Registration successful. Please login."}, status=201)

# Login Via Email and Password
class LoginView(generics.GenericAPIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(request, email=email, password=password)
        if user is None:
            return Response({"detail": "Invalid email or password"}, status=400)

        return Response({"message": "Login Successful!"}, status=200)


# Login Via Google OAuth
class GoogleRegisterView(APIView):
    def post(self, request):
        serializer = GoogleAuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']

        # ✅ Auto Login
        login(request, user)

        return Response(
            {"message": "Google login successful", "email": user.email},
            status=status.HTTP_200_OK
        )
        
@api_view(['POST'])
def google_login(request):
    email = request.data.get("email")
    name = request.data.get("name")

    user, created = CustomUser.objects.get_or_create(email=email, defaults={"username": name})

    if created:
        user.role = None  # ✅ Force role selection
        user.save()

    # ✅ Return user info including role
    return Response({
        "email": user.email,
        "username": user.username,
        "role": user.role,
    }, status=200)
    
    
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def set_role(request):
    serializer = RoleUpdateSerializer(instance=request.user, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Role updated successfully", "role": serializer.data["role"]})
    
    return Response(serializer.errors, status=400)
