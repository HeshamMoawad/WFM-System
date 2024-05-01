


def generate_perm(can_view,can_create,can_update,can_delete):
    return {
        "can_view":can_view,
        "can_create":can_create,
        "can_update":can_update,
        "can_delete":can_delete,
    }