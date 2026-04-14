from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.core.files.base import ContentFile
import uuid
from .models import Note
from .serializers import NoteSerializer, NoteUpdateSerializer
from .utils.markdown_utils import convert_to_html
from .utils.grammar_utils import grammar_check

# Create your views here.

@api_view(['GET'])
def list_notes(request):
    term = request.query_params.get('term', None)

    if term:
        notes = Note.objects.filter(user=request.user, title__icontains=term)
    else:
        notes = Note.objects.filter(user=request.user)

    serializer = NoteSerializer(notes, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
    
@api_view(['POST'])
def save_notes(request):
    serializer = NoteSerializer(data=request.data)
    
    if serializer.is_valid():
        filename = f"{uuid.uuid4()}_{serializer.validated_data['title']}.md"
        file = ContentFile(serializer.validated_data['content'].encode('utf-8'), name=filename)

        serializer.save(user=request.user, file=file)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def get_single_note(request, pk):
    try:
        note = Note.objects.get(pk=pk, user=request.user)
    except Note.DoesNotExist:
        return Response({'error': 'Note not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    with open(note.file.path, 'r') as f:
        content = f.read()
    
    serializer = NoteSerializer(note)
    data = serializer.data
    data['content'] = content
    return Response(data, status=status.HTTP_200_OK)

@api_view(['PUT'])
def update_note(request, pk):
    try:
        note = Note.objects.get(pk=pk, user=request.user)
    except Note.DoesNotExist:
        return Response({'error': 'Note not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = NoteUpdateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    with open(note.file.path, 'w') as f:
        f.write(serializer.validated_data['content'])
    
    note.title = serializer.validated_data['title']
    note.save()

    return Response(NoteSerializer(note).data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_note(request, pk):
    try:
        note = Note.objects.get(pk=pk, user=request.user)
    except Note.DoesNotExist:
        return Response({'error': 'Note not found.'}, status=status.HTTP_404_NOT_FOUND)

    if note.file and note.file.storage.exists(note.file.name):
        note.file.delete(save=False)
    
    note.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def get_grammar_result(request, pk):
    try:
        note = Note.objects.get(pk=pk, user=request.user)
    except Note.DoesNotExist:
        return Response({'error': 'Note not found.'}, status=status.HTTP_404_NOT_FOUND)


    with open(note.file.path, 'r') as f:
        content = f.read()

    result = grammar_check(content)

    if 'error' in result:
        return Response(result, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(result, status=status.HTTP_200_OK)

@api_view(['GET'])
def render_note(request, pk):
    try:
        note = Note.objects.get(pk=pk, user=request.user)
    except Note.DoesNotExist:
        return Response({'error': 'Note not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    with open(note.file.path, 'r') as f:
        content = f.read()


    return Response({'html': convert_to_html(content)}, status=status.HTTP_200_OK)



        