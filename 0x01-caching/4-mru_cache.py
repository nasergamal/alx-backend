#!/usr/bin/python3
""" MRU Caching """
from base_caching import BaseCaching


class MRUCache(BaseCaching):
    '''
    MRUCache:
        no store limit
        data stored in class variable: cache_data
        store and get data
    '''
    def __init__(self):
        '''add list of added items'''
        self.queue = []
        super().__init__()

    def put(self, key, item):
        ''' Store data into cache_data'''
        if key and item:
            if key in self.queue:
                self.queue.remove(key)
            if len(self.queue) == self.MAX_ITEMS:
                discard = self.queue.pop()
                del self.cache_data[discard]
                print('DISCARD:', discard)
            self.queue.append(key)
            self.cache_data[key] = item

    def get(self, key):
        ''' Return data from cache_data'''
        if key in self.queue:
            self.queue.append(self.queue.pop(self.queue.index(key)))
        return self.cache_data.get(key)
