from django.db import models

# Create your models here.
class user(models.Model):
    user_name = models.CharField(max_length=30)
    email = models.EmailField(max_length=50)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    password = models.CharField(max_length=20)

class user_data(models.Model):
    username = models.CharField(max_length=30)
    password = models.CharField(max_length=20)


# class user_prefrence(models.Model):
#     username = models.CharField(max_length=20)
#     checkbox = models.ManyToManyField(username)