#!/usr/bin/python3
""" Basic Caching """
from base_caching import BaseCaching


class BasicCache(BaseCaching):
    '''
    BasicCache:
        no store limit
        data stored in class variable: cache_data
        store and get data
    '''

    def put(self, key, item):
        ''' Store data into cache_data'''
        if key and item:
            self.cache_data[key] = item

    def get(self, key):
        ''' Return data from cache_data'''
        return self.cache_data.get(key)
