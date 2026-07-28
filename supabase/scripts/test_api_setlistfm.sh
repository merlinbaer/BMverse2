#!/bin/zsh

# This gets a single setlist by setlist id
curl -X GET --header 'Accept: application/json' --header 'x-api-key: 1234' 'https://api.setlist.fm/rest/1.0/setlist/6b500e96'


# This gets all setlist of an artist by artist mbid
# The result is limited to 20 setlists and all setliste has to be collected by calling per page
curl -X GET --header 'Accept: application/json' --header 'x-api-key: 1234' 'https://api.setlist.fm/rest/1.0/artist/27e2997f-f7a1-4353-bcc4-57b9274fa9a4/setlists?p=1'
