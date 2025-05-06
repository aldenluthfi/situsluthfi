from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def handler400(request, exception):
    if "language" not in request.session:
        request.session["language"] = "en"

    if request.session["language"] == "en":
        header_file = "header-en.html"
        footer_file = "footer-en.html"
        content_file = "400-en.html"

    if request.session["language"] == "id":
        header_file = "header-id.html"
        footer_file = "footer-id.html"
        content_file = "400-id.html"

    context = {
        "title": "400",
        "header": header_file,
        "footer": footer_file,
        "content": content_file,
    }

    if request.htmx:
        return HttpResponse(render(request, "partial.html", context))

    return HttpResponse(render(request, 'base.html', context), status=400)

def handler403(request, exception):
    if "language" not in request.session:
        request.session["language"] = "en"

    if request.session["language"] == "en":
        header_file = "header-en.html"
        footer_file = "footer-en.html"
        content_file = "403-en.html"

    if request.session["language"] == "id":
        header_file = "header-id.html"
        footer_file = "footer-id.html"
        content_file = "403-id.html"

    context = {
        "title": "403",
        "header": header_file,
        "footer": footer_file,
        "content": content_file,
    }

    if request.htmx:
        return HttpResponse(render(request, "partial.html", context))

    return HttpResponse(render(request, 'base.html', context), status=403)

def handler404(request, exception):
    if "language" not in request.session:
        request.session["language"] = "en"

    if request.session["language"] == "en":
        header_file = "header-en.html"
        footer_file = "footer-en.html"
        content_file = "404-en.html"

    if request.session["language"] == "id":
        header_file = "header-id.html"
        footer_file = "footer-id.html"
        content_file = "404-id.html"

    context = {
        "title": "404",
        "header": header_file,
        "footer": footer_file,
        "content": content_file,
    }

    if request.htmx:
        return HttpResponse(render(request, "partial.html", context))

    return HttpResponse(render(request, 'base.html', context), status=404)

def handler500(request):
    if "language" not in request.session:
        request.session["language"] = "en"

    if request.session["language"] == "en":
        header_file = "header-en.html"
        footer_file = "footer-en.html"
        content_file = "500-en.html"

    if request.session["language"] == "id":
        header_file = "header-id.html"
        footer_file = "footer-id.html"
        content_file = "500-id.html"

    context = {
        "title": "500",
        "header": header_file,
        "footer": footer_file,
        "content": content_file,
    }

    if request.htmx:
        return HttpResponse(render(request, "partial.html", context))

    return HttpResponse(render(request, 'base.html', context), status=500)