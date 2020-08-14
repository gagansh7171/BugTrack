from rest_framework import serializers
from .models import *



class ProfilePhotoS(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = ['id','display_picture']

class ProfileS(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Profile
        fields = ['id','user', 'disabled', 'admin','enr',  'display_picture']
        read_only_fields = ['enr']

class UserS(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username']

class ProjectS(serializers.ModelSerializer):

    teams = serializers.PrimaryKeyRelatedField(queryset=User.objects.all() , many=True, read_only=False)
    class Meta:
        model = Projects
        fields = ['id','project_name', 'wiki', 'date', 'teams']
        read_only_fields = [ 'date']



class ProjectSforTeam(serializers.ModelSerializer):
    teams = serializers.PrimaryKeyRelatedField(queryset=User.objects.all() , many=True)
    class Meta:
        model = Projects
        fields = ['id','project_name', 'teams']

class BugSForDash(serializers.ModelSerializer):
    creator = serializers.StringRelatedField(read_only=True)
    project = serializers.StringRelatedField(read_only=True)
    assigned_to = serializers.StringRelatedField()
    class Meta:
        model = Bug
        fields = ['id','project', 'assigned_to', 'description', 'creator', 'head', 'status', 'tag', 'date']
        read_only_fields = ['date', 'creator', 'project']


class BugS(serializers.ModelSerializer):
    creator = serializers.PrimaryKeyRelatedField(read_only=True)
    project = serializers.PrimaryKeyRelatedField(queryset=Projects.objects.all(),required=True)
    assigned_to = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(),required=False )
    class Meta:
        model = Bug
        fields = ['id','project', 'assigned_to', 'creator', 'description', 'head', 'status', 'tag', 'date']
        read_only_fields = ['date', 'creator']


class CommentsS(serializers.ModelSerializer):
    creator = serializers.PrimaryKeyRelatedField(read_only=True)
    bug = serializers.PrimaryKeyRelatedField(queryset=Bug.objects.all(),)
    class Meta:
        model = Comments
        fields = ['id','creator', 'date', 'description', 'bug']
        read_only_fields = ['date', 'creator']

class UserSS(serializers.ModelSerializer):
    profile = ProfileS()
    class Meta:
        model = User
        fields = ['id', 'username', 'profile']
class CommentsSS(serializers.ModelSerializer):
    creator = UserSS(read_only=True)
    bug = serializers.PrimaryKeyRelatedField(queryset=Bug.objects.all(), )
    class Meta:
        model = Comments
        fields = ['id','creator', 'date', 'description', 'bug']
        read_only_fields = ['date', 'creator']
