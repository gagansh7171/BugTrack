from django.shortcuts import render
from rest_framework.response import Response
from django.contrib.auth import login, logout
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializer import *
from .permissions import *
from rest_framework import viewsets
from rest_framework.views import APIView


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Projects.objects.all()
    serializer_class = ProjectS
    permission_classes = [isAdmin|teamMember]

    def perform_create(self, serializer):
        project = serializer.save()
        project.teams.add(self.request.user)
        project.save()


class BugViewSet(viewsets.ModelViewSet):
    queryset = Bug.objects.all()
    serializer_class = BugS
    permission_classes = [isAdmin|creator]

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileS
    permission_classes = [isAdmin]


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comments.objects.all()
    serializer_class = CommentsS
    permission_classes = [isAdmin|creator]

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

class MembersOfProject(APIView):

    def get(self, request, pk):

        a = User.objects.filter(projects=pk).values('profile__id')
        b = [ Profile.objects.get(id=i['profile__id']) for i in a]
        c = ProfileS(b, many=True)
        return Response(c.data)

class BugsOfProject(APIView):

    def get(self, request, pk):
        serializer = BugS(Projects.objects.get(pk=pk).bugs.all(), many=True)
        return Response(serializer.data)

class CommentsOnBugs(APIView):

    def get(self, request, pk):
        serializer = CommentsS(Bug.objects.get(pk=pk).comments.all(), many=True)
        return Response(serializer.data)
