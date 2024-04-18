from djongo import models
import uuid

# Create your models here.

class User(models.Model):
    class Meta:
        app_label = 'PlatePalsApp'
        db_table = 'user'

    userguid = models.ObjectIdField(primary_key=True, db_column='_id')
    user_id = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    rooms = models.ManyToManyField('Room', related_name='members')

    def save(self, *args, **kwargs):
        # Generate a unique user_id if it's not provided
        if not self.user_id:
            self.user_id = uuid.uuid4().hex[:12]  # Generate a random 12-character string
        super().save(*args, **kwargs)

class Room(models.Model):
    class Meta:
        app_label = 'PlatePalsApp'
        db_table = 'room'
    roomguid = models.ObjectIdField(primary_key=True, db_column='_id')
    code = models.CharField(max_length=6, unique=True)
    admin = models.ForeignKey(User, on_delete=models.CASCADE, related_name='admin_of_rooms')
    members = models.ManyToManyField(User, related_name='rooms')
    result = models.CharField(max_length=255)
    islocked = models.BooleanField(default=False) 
