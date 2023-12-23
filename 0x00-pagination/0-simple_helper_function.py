#!/usr/bin/env python3
''' pagination '''


def index_range(page: int, page_size: int) -> tuple:
    '''return a tuple with start and end index'''
    return ((page - 1) * page_size, page * page_size)
