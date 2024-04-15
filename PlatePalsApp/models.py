from django.db import models

# Create your models here.

class User(models.Model):
    class Meta:
        app_label = 'PlatePalsApp'
    userguid = models.UUIDField(primary_key=True)
    user_id = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

class Room(models.Model):
    class Meta:
        app_label = 'PlatePalsApp'
    roomguid = models.UUIDField(primary_key=True)
    code = models.CharField(max_length=50, unique=True)
    admin = models.ForeignKey(User, on_delete=models.CASCADE, related_name='admin_of_rooms')
    members = models.ManyToManyField(User, related_name='rooms')
    result = models.CharField(max_length=255)
