from django.shortcuts import render, get_object_or_404
from .models import Article

def glossary(request):
    ...

def article(request, hash):
    if "language" not in request.session:
        request.session["language"] = "id"

    if request.session["language"] == "en":
        header_file = "header-en.html"
        footer_file = "footer-en.html"
        content_file = "article.html"

    if request.session["language"] == "id":
        header_file = "header-id.html"
        footer_file = "footer-id.html"
        content_file = "article.html"

    context = {
        "title": f"aldenluthfi",
        "header": header_file,
        "footer": footer_file,
        "content": content_file,
    }

    if request.htmx:
        return render(request, "partial.html", context)

    return render(request, "base.html", context)

"""
def article(request, hash):

    content = get_object_or_404(Article, hash=hash)

    if "language" not in request.session:
        request.session["language"] = "id"

    if request.session["language"] == "en":
        header_file = "header-en.html"
        footer_file = "footer-en.html"
        content_file = "article.html"
        article_title = content.title_en
        article_content = content.content_en

    if request.session["language"] == "id":
        header_file = "header-id.html"
        footer_file = "footer-id.html"
        content_file = "article.html"
        article_title = content.title_id
        article_content = content.content_id

    article_created = content.created_at

    context = {
        "title": f"aldenluthfi - {article_title}",
        "header": header_file,
        "footer": footer_file,
        "content": content_file,

        'article-title': article_title,
        'article-content': article_content,
        'article-created': article_created
    }

    if request.htmx:
        return render(request, "partial.html", context)

    return render(request, "base.html", context)
"""
