#!/usr/bin/python3
""" LFU Caching """
from base_caching import BaseCaching


class LFUCache(BaseCaching):
    '''
    LFUCache:
        no store limit
        data stored in class variable: cache_data
        store and get data
    '''
    def __init__(self):
        '''add list of added items'''
        self.usage = {}
        self.queue = []
        super().__init__()

    def put(self, key, item):
        ''' Store data into cache_data'''
        if key and item:
            if key in self.usage:
                self.queue.remove(key)

            if len(self.queue) == self.MAX_ITEMS:
                discard = [x[0] for x in self.usage.items()
                           if x[1] == min(self.usage.values())]
                if len(discard) > 1:
                    for i in self.queue:
                        if i in discard:
                            discard = i
                            break
                else:
                    discard = discard[0]
                self.queue.remove(discard)
                del self.usage[discard]
                del self.cache_data[discard]
                print('DISCARD:', discard)
            self.queue.append(key)
            self.usage[key] = self.usage.get(key, 0) + 1
            self.cache_data[key] = item

    def get(self, key):
        ''' Return data from cache_data'''
        if key in self.usage:
            self.usage[key] += 1
            self.queue.append(self.queue.pop(self.queue.index(key)))
        return self.cache_data.get(key)
