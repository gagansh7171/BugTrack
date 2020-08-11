from django.shortcuts import render
from rest_framework.response import Response
from django.contrib.auth import login, logout
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializer import *
from .permissions import *
from rest_framework import viewsets
from rest_framework.views import APIView
from django.http import JsonResponse, HttpResponseForbidden, HttpResponse, HttpResponseBadRequest
import json
import requests
import string 
import random 

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserS
    permission_classes = [isSelf]


class PhotoViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfilePhotoS
    permission_classes = [isSelfPhoto]


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Projects.objects.all()
    serializer_class = ProjectS
    permission_classes = [isAdmin|teamMember]

    def perform_create(self, serializer):
        project = serializer.save()
        project.teams.add(self.request.user)
        project.save()

    @action(methods=['GET'], detail=True, url_path='ismember', url_name='ismember')
    def IsMember(self, request, pk):
        if request.user.is_authenticated and request.user.is_active and (request.user.profile.disabled==False) and (request.user in Projects.objects.get(id=pk).teams.all() or request.user.profile.admin) :
            return JsonResponse({'member' : True})
        else :
            return JsonResponse({'member' : False})

    @action(methods=['GET'], detail=False, url_path='myteam', url_name='myteam')
    def MyTeams(self, request):
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
    
    @action(methods=['GET'], detail=True, url_path='addmem', url_name='addmem')
    def ProjectNonMember(self, request, pk):
        if request.user.is_authenticated:
            user = request.user
            if user.is_active and (user.profile.disabled==False):
                a = User.objects.exclude(id__in = ProjectS(Projects.objects.get(id=pk)).data['teams'])
                serializer = UserS(a, many=True)
                b = {}
                c = 0
                for i in serializer.data:
                    b[c] = dict(i)
                    c=c+1
                return JsonResponse(dict(b))
    
    @action(methods=['PATCH'], detail=True, url_path='addmember', url_name='addmember')
    def ProjectMemberAdd(self, request, pk):
        if request.user.is_authenticated:
            user = request.user
            if user.is_active and (user.profile.disabled==False) and (user in Projects.objects.get(id=pk).teams.all()):
                Projects.objects.get(id=pk).teams.add(User.objects.get(id=request.data['teams']))
                return HttpResponse('added')
    
    @action(methods=['PATCH'], detail=True, url_path='deletemem', url_name='deletemem')
    def ProjectMemberDelete(self, request, pk):
        if request.user.is_authenticated:
            user = request.user
            if user.is_active and (user.profile.disabled==False) and (user in Projects.objects.get(id=pk).teams.all()):
                Projects.objects.get(id=pk).teams.remove(User.objects.get(id=request.data['teams']))
                # print(dict(request.data))
                return HttpResponse('removed')


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

    @action(methods=['POST', 'OPTIONS'], detail=False, url_path='token', url_name='token')
    def TokenParser(self, request):
        
        try:
            token = json.loads(request.body.decode('utf-8'))
            auth = token['code']
        except:
            return HttpResponseBadRequest()
        
        data = {
            'client_id': 'InkEzNrdetKn6grsh3bEzumxUXKwVXgwxZxg2BDo',
            'client_secret': 'tF0joMwszxHRuNPZSQAzo1wzHA5qhFVPWStg959ZcrY4HJg4gDOKXvcAUjSn4jSY56aZ8LVF09EK3ps5KOqZMRH9TNhX4bKs2le2D4NTkmRR83RKmkcsRYGoGhONUl1d',
            'grant_type': 'authorization_code',
            'redirect_url': 'http://localhost:3000/loggit/',
            'code': auth
        }

        response = requests.post('https://internet.channeli.in/open_auth/token/', data=data)
        response = json.loads(response.text)
        access_token = response['access_token']
        #     print('******************************************second request received')
        response2 = requests.get(
            url="https://internet.channeli.in/open_auth/get_user_data/",
            headers={'Authorization': f'Bearer {access_token}'}
        )
        response2 = json.loads(response2.text)
        try:
            roles = response2['person']['roles']
            user = Profile.objects.get(enr=response2['student']['enrolmentNumber']).user
            login(request=request, user=user)
            # print('***************************************************exists')
            return HttpResponse('exists')
        except Profile.DoesNotExist:
            #create user
            maintainer = False
            for i in roles:
                if i['role'] == 'Maintainer':
                    maintainer = True
                    break

            if maintainer:
                is_admin = False
                if response2["student"]["currentYear"] >= 4:
                    is_admin = True
                disabled = False
                enr = response2["student"]["enrolmentNumber"]
                email = response2["contactInformation"]["instituteWebmailAddress"]
                name = (response2["person"]["fullName"]).split()
                
                 
                first_name = name[0]
                last_name = name[1]
                username = str(''.join(random.choices(string.ascii_uppercase + string.digits, k = 15)))

                user = User.objects.create(
                    is_superuser=False,
                    username=username,
                    first_name=first_name,
                    last_name=last_name,
                    email=email,
                    is_staff = True,
                    is_active = True)
                try :
                    profile = Profile.objects.create(
                        user=user,
                        disabled= False,
                        admin=is_admin,
                        enr=enr,
                        display_picture=response2["person"]["display_picture"]
                    )
                except:
                    profile = Profile.objects.create(
                        user=user,
                        disabled= False,
                        admin=is_admin,
                        enr=enr,)
                login(request=request, user=user)
                return HttpResponse('created')
            else : 
                return JsonResponse({"status": "user not in IMG"}, status=status.HTTP_401_UNAUTHORIZED)

    @action(methods=['GET'], detail=False, url_path='profile', url_name='profile')
    def ProfileOfUsers(self, request):
        if request.user.is_authenticated:
            profile = Profile.objects.get(id=int(request.GET.get('slug')))
            if profile.user.is_active and (profile.disabled==False):
                serializer = ProfileS(profile, context={"request": request})
                username = request.user.username
                b = serializer.data
                b['username'] = username
                b['email'] = request.user.email
                b['fname'] = request.user.first_name
                b['lname'] = request.user.last_name
                b['date_joined'] = request.user.date_joined
                return JsonResponse(b)  

    @action(methods=['GET'], detail=False, url_path='user', url_name='user')
    def get_user(self, request):
        if request.user.is_authenticated:
            user = request.user
            if user.is_active and (user.profile.disabled==False):
                serializer = ProfileS(user.profile, context={"request": request})
                username = user.username
                b = serializer.data
                b['username'] = username
                b['userid'] = user.id
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