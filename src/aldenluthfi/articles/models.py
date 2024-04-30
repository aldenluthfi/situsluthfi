from django.db import models

class Article(models.Model):
    hash = models.SmallIntegerField(unique=True)

    cover_image = models.FileField()

    title_id = models.CharField(max_length=100, unique=True)
    title_en = models.CharField(max_length=100, unique=True)

    content_id = models.TextField()
    content_en = models.TextField()

    created_at = models.DateTimeField()

    def __str__(self):
        return f"{self.title_en} - {self.title_id}"