from django.shortcuts import redirect, render

# Create your views here.
def main(request):

    if "language" not in request.session:
        request.session["language"] = "id"

    if request.session["language"] == "en":
        header_file = "header-en.html"
        footer_file = "footer-en.html"
        content_file = "main-en.html"

    if request.session["language"] == "id":
        header_file = "header-id.html"
        footer_file = "footer-id.html"
        content_file = "main-id.html"

    context = {
        "title": "aldenluthfi",
        "header": header_file,
        "footer": footer_file,
        "content": content_file,
    }

    if request.htmx:
        return render(request, "partial.html", context)

    return render(request, "base.html", context)

def toggle_language(request):
    assert request.htmx

    if request.session["language"] == "en":
        request.session["language"] = "id"
    elif request.session["language"] == "id":
        request.session["language"] = "en"

    return redirect(request.htmx.current_url)
