from contextlib import redirect_stdout
from pyexpat.errors import messages
from django.shortcuts import render,redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate


# Create your views here.
def index(request):
    return render(request,'home.html')
    
def login(request):
    return render(request,'login.html')

def sign(request):
    return render(request,'signup.html')

def signup(request):
    if request.method == "POST":
        username =  request.post['username']
        fname = request.post['fname']
        lname = request.post['lname']
        email = request.post['email']
        pass1 = request.post['pass1']
        pass2 = request.post['pass2']

        myuser = User.objects.create_user(username,email,pass1)
        myuser.first_name = fname
        myuser.last_name = lname    

        myuser.save()

        messages.sucess(request,"Your account is succesfully registered..")

        return redirect('login')
    return render(request,'signup.html')


def signin(request):
    if request.method == 'POST':
        username = request.POST['username']
        pass1 = request.POST['pass1']

        user = authenticate(username= username , password = pass1)

        if user is not None:
            login(request,user)
            fname = user.first_name
            return(request,'home.html')
        else:
            messages.error(request,"Incorrect details")
            return redirect('index')

    return render(request,'login.html')

def base(request):
    return render(request,'base.html')

class 