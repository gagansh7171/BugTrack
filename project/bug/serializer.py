from rest_framework import serializers
from .models import *



class ProfileS(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Profile
        fields = ['id','user', 'disabled', 'admin','enr',  'display_picture']
        read_only_fields = ['enr']
    


class ProjectS(serializers.ModelSerializer):

    teams = serializers.PrimaryKeyRelatedField(queryset=User.objects.all() , many=True)
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
        fields = ['id','project', 'assigned_to', 'creator', 'head', 'status', 'tag', 'date']
        read_only_fields = ['date', 'creator']


class BugS(serializers.ModelSerializer):
    creator = serializers.PrimaryKeyRelatedField(read_only=True)
    project = serializers.PrimaryKeyRelatedField(read_only=True)
    assigned_to = serializers.PrimaryKeyRelatedField(queryset=User.objects.all() )
    class Meta:
        model = Bug
        fields = ['id','project', 'assigned_to', 'creator', 'description', 'head', 'status', 'tag', 'date']
        read_only_fields = ['date', 'creator']


class CommentsS(serializers.ModelSerializer):
    creator = serializers.PrimaryKeyRelatedField(read_only=True)
    bug = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Comments
        fields = ['id','creator', 'date', 'description', 'bug']
        read_only_fields = ['date', 'creator']