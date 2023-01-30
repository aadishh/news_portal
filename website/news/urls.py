from django.contrib import admin
from django.urls import path,include

from news import views

urlpatterns = [
    path('',views.index),
    path('login/',views.login,name= 'login'),
    path('signup/',views.signup,name = 'signup')
]
