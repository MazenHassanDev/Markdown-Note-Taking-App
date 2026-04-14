from rest_framework import serializers
from .models import Note

class NoteSerializer(serializers.ModelSerializer):
    content = serializers.CharField(write_only=True)

    class Meta:
        model = Note
        fields = ['id', 'title', 'file', 'content', 'created_at']
        read_only_fields = ['id', 'file', 'created_at']

    def validate_title(self, data):
        if not data.strip():
            raise serializers.ValidationError('Title is required.')
        return data.strip()
    
    def validate_content(self, data):
        if not data.strip():
            raise serializers.ValidationError('Content is required.')
        return data.strip()

    def create(self, validated_data):
        validated_data.pop('content', None)
        return super().create(validated_data)


class NoteUpdateSerializer(serializers.Serializer):
    title = serializers.CharField()
    content = serializers.CharField()

    def validate_title(self, data):
        if not data.strip():
            raise serializers.ValidationError('Title is required.')
        return data.strip()

    def validate_content(self, data):
        if not data.strip():
            raise serializers.ValidationError('Content is required.')
        return data.strip()