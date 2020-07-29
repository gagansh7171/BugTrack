from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField
from django.contrib.auth.models import User



class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    disabled = models.BooleanField(default=False)
    admin = models.BooleanField(default=False)
    enr = models.IntegerField(default=0)
    display_picture = models.ImageField(upload_to='pic/', default='/pic/default_profile_photo.jpeg')

    def __str__(self):
        return self.user.username

class Projects(models.Model):
    project_name = models.CharField(max_length=20, unique=True)
    wiki = RichTextUploadingField()
    creator = models.ForeignKey(Profile ,on_delete=models.SET_NULL, null=True, related_name='myprojects')
    date = models.DateTimeField(auto_now_add=True)
    teams = models.ManyToManyField(User, related_name='projects')

    def __str__(self):
        return self.project_name

class Bug(models.Model):
    project = models.ForeignKey(Projects, on_delete=models.CASCADE, related_name='bugs')
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned')
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mybugs')
    description = RichTextUploadingField()
    head = models.CharField(max_length=20)
    status = models.IntegerField(default=2)
    #0 means solved
    #1 means assigned
    #2 means created
    #3 help wanted
    priority = models.IntegerField( default=2)
    # 3 highest
    # 2 medium
    # 1 low
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.creator.username + ' ' + self.assigned_to.username
    
    class Meta:
        ordering = ['-status', '-priority', '-date']


class Comments(models.Model):
    description = RichTextUploadingField()
    date = models.DateTimeField(auto_now_add=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mycomments')
    bug = models.ForeignKey(Bug, on_delete=models.CASCADE, related_name='comments')
    
    def __str__(self):
        return self.creator.username + ' ' + self.description[:15]
    class Meta:
        ordering = ['-date']