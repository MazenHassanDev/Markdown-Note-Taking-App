from django.contrib.auth.models import User
from rest_framework import serializers

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def validate_username(self, data):
        if User.objects.filter(username=data).exists():
            raise serializers.ValidationError('Username already taken.')
        return data
    
    def validate_email(self, data):
        if User.objects.filter(email=data).exists():
            raise serializers.ValidationError('Email already exists.')
        return data
        
    def validate_password(self, data):
        if len(data) < 8:
            raise serializers.ValidationError('Password must be at least 8 characters.')
        return data
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email = validated_data['email'],
            password = validated_data['password']
        )
        return user
