from contextlib import redirect_stdout
from django.contrib import messages
from django.shortcuts import render, redirect ,HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate , login as auth_login


# Create your views here.
def index(request):
    return render(request, 'home.html',{'toi_news':toi_news})


def login(request):
    return render(request, 'login.html')


def signup(request):
    print("hello")
    return render(request, 'signup.html')


def sign(request):
    if request.method == "POST":
        email = request.POST.get('email')
        username = request.POST.get('username')
        fname = request.POST.get('fname')
        lname = request.POST.get('lname')
        pass1 = request.POST.get('pass1')
        pass2 = request.POST.get('pass2')
        if pass1 != pass2:
            return HttpResponse("password is not same")
        my_user = User.objects.create_user(username,email,pass1)
        my_user.save()
        messages.success(request,'User has been created..') 
        return render(request, 'signup.html')
    else:
        return render(request, 'signup.html')


def signin(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        pass1 = request.POST.get('pass')
        user = authenticate(request,username=username, password=pass1)
        if user is not None:
            auth_login(request,user)
            return render(request,'base.html')
        else:
            return HttpResponse("Wrong login details")
            # return render(request,'login.html')



def base(request):
    return render(request, 'base.html')

def catagory(request):
    return render(request,'catagory.html')

def contact(request):
    return render(request, 'contact.html')


def article(request):
    return render(request, 'article.html')


def blog(request):
    return render(request, 'blog.html')


def checkbox(request):
    check = []
    if request.method == 'POST':
        check = request.POST.get('checksbox') 
        return render(request,'blog.html')




# web scrapping


from django.shortcuts import render
import requests
from bs4 import BeautifulSoup

# GEtting news from Times of India

toi_r = requests.get("https://timesofindia.indiatimes.com/briefs")
toi_soup = BeautifulSoup(toi_r.content, 'html.parser')

toi_headings = toi_soup.find_all('h2')

toi_headings = toi_headings[0:-13] # removing footers

toi_news = []

for th in toi_headings:
    toi_news.append(th.text)