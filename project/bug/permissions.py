from rest_framework import permissions
from .models import *

class isAdmin(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        isadmin = request.user.profile.admin

        return isadmin

class teamMember(permissions.BasePermission):

    def has_object_permission(self,request,view,obj):

        if request.method in permissions.SAFE_METHODS:
            return True
        else:

            a = request.user.projects.all()
    
            return obj in a

class creator(permissions.BasePermission):

    def has_object_permission(self,request,view,obj):

        if request.method in permissions.SAFE_METHODS:
            return True

        else:
            
            return obj.creator == request.user