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
    date = models.DateTimeField(auto_now_add=True)
    teams = models.ManyToManyField(User, related_name='projects')

    def __str__(self):
        return self.project_name

class Bug(models.Model):
    project = models.ForeignKey(Projects, on_delete=models.CASCADE, related_name='bugs')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='assigned')
    creator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='mybugs')
    description = RichTextUploadingField()
    head = models.CharField(max_length=20)
    status = models.IntegerField(default=2)
    #0 means solved
    #1 means assigned
    #2 means created
    tag = models.IntegerField(default=7)
    # 7 bug
    # 6 Security
    # 5 help wanted
    # 4 wontfix
    # 3 enhancement
    # 2 Back-end
    # 1 Front-end
    # 0 Typo
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.creator.username + ' ' + self.assigned_to.username
    
    class Meta:
        ordering = ['-status', '-date']


class Comments(models.Model):
    description = RichTextUploadingField()
    date = models.DateTimeField(auto_now_add=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mycomments')
    bug = models.ForeignKey(Bug, on_delete=models.CASCADE, related_name='comments')
    
    def __str__(self):
        return self.creator.username + ' ' + self.description[:15]
    class Meta:
        ordering = ['-date']