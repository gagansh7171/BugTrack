from django.shortcuts import render
from rest_framework.response import Response
from django.contrib.auth import login, logout
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializer import *
from .permissions import *
from rest_framework import viewsets
from rest_framework.views import APIView
from django.http import JsonResponse, HttpResponseForbidden


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Projects.objects.all()
    serializer_class = ProjectS
    permission_classes = [isAdmin|teamMember]

    def perform_create(self, serializer):
        project = serializer.save()
        project.teams.add(self.request.user)
        project.save()

    @action(methods=['GET'], detail=False, url_path='myteam', url_name='myteam')
    def ProjectsOfUser(self, request):
        if request.user.is_authenticated:
            user = request.user
            if user.is_active and (user.profile.disabled==False):
                serializer = ProjectSforTeam(user.projects.all(), many=True)
                a={}
                i=0
                for b in serializer.data:
                    a[i] = dict(b)
                    i=i+1
                return JsonResponse(a)

    @action(methods=['GET'], detail=False, url_path='search', url_name='search')
    def ProjectSearch(self, request):
        if request.user.is_authenticated:
            user = request.user
            if user.is_active and (user.profile.disabled==False):
                b = Projects.objects.filter(project_name__icontains=request.GET.get('slug'))
                serializer = ProjectS(b, many=True)
                a={}
                i=0
                for b in serializer.data:
                    a[i] = dict(b)
                    i=i+1
                return JsonResponse(a)


class BugViewSet(viewsets.ModelViewSet):
    queryset = Bug.objects.all()
    serializer_class = BugS
    permission_classes = [isAdmin|creator]

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)
    
    @action(methods=['GET'], detail=False, url_path='assigned', url_name='assigned')
    def assignedBugs(self, request):
        if request.user.is_authenticated:
            user = request.user
            if user.is_active and (user.profile.disabled==False):
                serializer = BugSForDash(user.assigned.all(), many=True)
                a={}
                i=0
                for b in serializer.data:
                    a[i] = dict(b)
                    i=i+1
                return JsonResponse(a)
    
    @action(methods=['GET'], detail=False, url_path='reported', url_name='reported')
    def reportedBugs(self, request):
        if request.user.is_authenticated:
            user = request.user
            if user.is_active and (user.profile.disabled==False):
                serializer = BugSForDash(user.mybugs.all(), many=True)
                a={}
                i=0
                for b in serializer.data:
                    a[i] = dict(b)
                    i=i+1
                return JsonResponse(a)



class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileS
    permission_classes = [isAdmin]

    @action(methods=['GET'], detail=False, url_path='user', url_name='user')
    def get_user(self, request):
        if request.user.is_authenticated:
            user = request.user
            if user.is_active and (user.profile.disabled==False):
                serializer = ProfileS(user.profile, context={"request": request})
                username = user.username
                b = serializer.data
                b['username'] = username
                b['email'] = user.email
                b['fname'] = user.first_name
                b['lname'] = user.last_name
                b['date_joined'] = user.date_joined
                return JsonResponse(b)  
            else:
                return HttpResponseForbidden()

        else:
            return HttpResponseForbidden()
    
    @action(methods=['GET'], detail=False, url_path='logout', url_name='logout')
    def customlogout(self, request):
        if request.user.is_authenticated:
            logout(request)
            return JsonResponse({'status': 'Logged out'})
        else:
            return HttpResponseForbidden()
    
    @action(methods=['GET'], detail=False, url_path='projects', url_name='projects')
    def ProjectsOfUser(self, request):
        if request.user.is_authenticated:
            user = request.user
            if user.is_active and (user.profile.disabled==False):
                serializer = ProjectS(user.projects.all(), many=True)
                a={}
                i=0
                for b in serializer.data:
                    a[i] = dict(b)
                    i=i+1
                return JsonResponse(a)
    
    @action(methods=['GET'], detail=False, url_path='adminview', url_name='adminview')
    def AdminView(self, request):
        if request.user.is_authenticated:
            user1 = request.user
            if user1.is_active and (user1.profile.disabled==False) and (user1.profile.admin==True):
                serializer = ProfileS(Profile.objects.exclude(user=user1), many=True, context={"request": request})
                a={}
                i=0
                for b in serializer.data:
                    b['username'] = User.objects.get(id=b['user']).username
                    b['email'] = User.objects.get(id=b['user']).email
                    a[i] = dict(b)
                    i=i+1
                return JsonResponse(a)
    
    @action(methods=['GET'], detail=False, url_path='search', url_name='search')
    def UserSearch(self, request):
        if request.user.is_authenticated:
            user = request.user
            if user.is_active and (user.profile.disabled==False):
                b = Profile.objects.filter(user__in=User.objects.filter(username__icontains=request.GET.get('slug')).values_list('id'))
                serializer = ProfileS(b,context={"request": request},  many=True)
                a={}
                i=0
                for b in serializer.data:
                    b['username'] = User.objects.get(id=b['user']).username
                    b['email'] = User.objects.get(id=b['user']).email
                    a[i] = dict(b)
                    i=i+1
                return JsonResponse(a)



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
        c = ProfileS(b,context={"request": request}, many=True)

        a={}
        i=0
        for b in c.data:
            b['username'] = User.objects.get(id=b['user']).username
            b['email'] = User.objects.get(id=b['user']).email
            a[i] = dict(b)
            i=i+1

        return JsonResponse(a)

class BugsOfProject(APIView):

    def get(self, request, pk):
        serializer = BugS(Projects.objects.get(pk=pk).bugs.all(), many=True)
        return Response(serializer.data)

class CommentsOnBugs(APIView):

    def get(self, request, pk):
        serializer = CommentsS(Bug.objects.get(pk=pk).comments.all(), many=True)
        return Response(serializer.data)


from django.shortcuts import render


def index(request):
    return render(request, "build/index.html")