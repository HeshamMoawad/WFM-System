import datetime
from typing import Any, Iterable, Union

def parse_date(date_str,formats:list):
    
    for date_format in formats:
        try:
            return datetime.datetime.strptime(date_str, date_format)
        except ValueError:
            continue
    
    raise ValueError(f"Date format not recognized: {date_str} don't match {' ,'.join(formats)}")


def _types_protector(var: Any, type_s: Union[type, Iterable[type]]) -> None:
    """
    Validates the type of a variable against a single type or an iterable of types.

    Args:
        var (Any): The variable to validate.
        type_s (Union[type, Iterable[type]]): The expected type or iterable of types.

    Raises:
        TypeError: If the variable's type does not match the expected type(s).
    """
    if not isinstance(type_s, Iterable):
        type_s = (type_s,)
    if not isinstance(var, tuple(type_s)):
        expected_types = ', '.join(t.__name__ for t in type_s)  # Get type names for better error messages
        raise TypeError(f"Expected type(s) {expected_types}, but got {type(var).__name__}")
