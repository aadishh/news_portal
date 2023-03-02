from django.contrib import admin
from django.urls import path,include

from news import views

urlpatterns = [
    path('',views.index),
    path('login/',views.login,name= 'login'),
    path('signup/',views.sign,name = 'signup'),
    path('signin',views.signin,name = 'sigin'),
    path('catagory/',views.catagory,name = 'catagory'),
    path('blog/',views.blog,name = 'blog'),
    path('article/',views.article,name = 'article'),
    path('contact/',views.contact,name = 'contact'),
]
