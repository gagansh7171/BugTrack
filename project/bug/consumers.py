import requests
import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .models import Bug, Comments

class CommentConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.bug_id = self.scope['url_route']['kwargs']['pk']

    def connect(self):
        self.user = self.scope['user']
        if self.user.is_authenticated:
            try:
                bug = Bug.objects.get(pk=self.bug_id)
                async_to_sync(self.channel_layer.group_add)(
                    self.bug_id,
                    self.channel_name
                )
                self.accept()
            except:
                self.close()
        else:
            self.close()

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.bug_id,
            self.channel_name
        )

    def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        comment_id = text_data_json['comment_id']
        print('recieved')
        async_to_sync(self.channel_layer.group_send)(
            self.bug_id,
            {
                'type': 'update_comment',
                'comment': comment_id,
            }
        
        )

    def update_comment(self, event):
        comment = event['comment']
        print('sent')
        self.send(text_data=json.dumps({
            'comment':comment
        }))



