from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

app_name = 'bug'
router = DefaultRouter()
router.register('user', UserViewSet, basename='user')
router.register('project', ProjectViewSet, basename='projects')
router.register('bugs', BugViewSet, basename='bugs')
router.register('profile', ProfileViewSet, basename='profile')
router.register('comments', CommentViewSet, basename='comment')
urlpatterns = [
    path('', include(router.urls)),
    path('project/<int:pk>/team/', MembersOfProject.as_view()),
    path('project/<int:pk>/bugs/', BugsOfProject.as_view()),
    path('bugs/<int:pk>/comments/', CommentsOnBugs.as_view()),
    path('front',index, name='index')
]
