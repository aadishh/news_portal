from django.db import models

# Create your models here.
class user(models.Model):
    userID = models.AutoField(primary_key=True)
    userpassword = models.models.CharField(max_length=20)

class userdata(models.Model):
    intrests = models.Model()