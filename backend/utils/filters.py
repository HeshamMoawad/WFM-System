from django.contrib.auth.models import AbstractUser
from users.models import Group , User , GenericFilter
from django.contrib.contenttypes.models import ContentType
from django.db.models import QuerySet ,Model



def filter_queryset_with_permissions(user:User,queryset:QuerySet,model:Model)->QuerySet:
    context = {
        "user":user,
        "queryset":queryset
    }
    if not user.is_superuser:
        cont_type = ContentType.objects.get_for_model(model)
        filters_text_list = GenericFilter.objects.filter(groups__in=user.custom_groups.values_list("uuid"),content_type=cont_type).order_by('layer_index').values_list("get_queryset_text",flat=True) 
        filters_text_list = [f"\n{f}\n" for f in filters_text_list ]
        if filters_text_list :
            exec("".join(filters_text_list),{},context)
        else :
            context['queryset'] = queryset.none()
    return context['queryset']
