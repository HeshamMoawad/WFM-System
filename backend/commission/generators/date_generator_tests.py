from django.test import TestCase
from .date_generator import GenerateDate
from datetime import datetime

class DateGeneratorTest(TestCase):

    def test_not_equal_splits(self):
        generated_range = GenerateDate(from_date="5-1-2024",to_date="10-1-2024",split_by=2)
        self.assertListEqual(
            generated_range,
            [
                (datetime(2024,1,5),datetime(2024,1,7)) ,
                (datetime(2024,1,7),datetime(2024,1,9)) ,
                (datetime(2024,1,9),datetime(2024,1,10)) ,
            ]
        )
    
    def test_conflect_dates_range(self):
        generated_range = GenerateDate(from_date="10-1-2024",to_date="5-1-2024",split_by=2)
        self.assertListEqual(
            generated_range,
            [
                (datetime(2024,1,5),datetime(2024,1,7)) ,
                (datetime(2024,1,7),datetime(2024,1,9)) ,
                (datetime(2024,1,9),datetime(2024,1,10)) ,
            ]
        )
    
    def test_as_generator_range(self):
        result = [
                (datetime(2024,1,5),datetime(2024,1,7)) ,
                (datetime(2024,1,7),datetime(2024,1,9)) ,
                (datetime(2024,1,9),datetime(2024,1,10)) 
            ]
        for index , tup in enumerate(GenerateDate(from_date="10-1-2024",to_date="5-1-2024",split_by=2 , as_generator=True)):
            self.assertTupleEqual(
                tuple(tup),
                result[index]
            )


