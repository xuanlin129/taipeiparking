import 'dotenv/config'

import linebot from 'linebot'
import axios from 'axios'

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.on('message', async event => {
  if (event.message.type === 'text') {
    try {
      const { data } = await axios.get('https://tcgbusfs.blob.core.windows.net/blobtcmsv/TCMSV_alldesc.json')
      for (const info of data.data.park) {
        if (info.name === event.message.text) {
          const location = {
            type: 'location',
            title: info.name,
            address: info.address,
            latitude: info.EntranceCoord.EntrancecoordInfo[0].Xcod,
            longitude: info.EntranceCoord.EntrancecoordInfo[0].Ycod
          }
          const messages = {
            type: 'flex',
            altText: 'park',
            contents: {
              type: 'bubble',
              hero: {
                type: 'image',
                url: 'https://jobstoreblog.s3-accelerate.amazonaws.com/magazine/wp-content/uploads/2020/02/google-map-features-.jpg',
                size: 'full',
                aspectRatio: '20:13',
                aspectMode: 'cover'
                // action: {
                //   type: 'uri',
                //   uri: `https://maps.google.com/maps?q=${info.EntranceCoord.EntrancecoordInfo[0].Xcod},${info.EntranceCoord.EntrancecoordInfo[0].Ycod}`
                //   uri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(info.name)}`
                // }
              },
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: info.name,
                    weight: 'bold',
                    size: 'xl',
                    align: 'center',
                    wrap: true
                  },
                  {
                    type: 'box',
                    layout: 'vertical',
                    margin: 'lg',
                    spacing: 'sm',
                    contents: [
                      {
                        type: 'box',
                        layout: 'baseline',
                        spacing: 'sm',
                        contents: [
                          {
                            type: 'text',
                            text: '地址',
                            color: '#aaaaaa',
                            size: 'sm',
                            flex: 1
                          },
                          {
                            type: 'text',
                            text: info.address,
                            wrap: true,
                            color: '#666666',
                            size: 'sm',
                            flex: 5
                          }
                        ]
                      },
                      {
                        type: 'box',
                        layout: 'baseline',
                        spacing: 'sm',
                        contents: [
                          {
                            type: 'text',
                            text: '電話',
                            color: '#aaaaaa',
                            size: 'sm',
                            flex: 1
                          },
                          {
                            type: 'text',
                            text: info.tel,
                            wrap: true,
                            color: '#666666',
                            size: 'sm',
                            flex: 5
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              footer: {
                type: 'box',
                layout: 'vertical',
                spacing: 'sm',
                contents: [
                  {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                      {
                        type: 'text',
                        text: '收費方式',
                        color: '#666666',
                        size: 'md',
                        weight: 'bold',
                        decoration: 'underline',
                        align: 'center'
                      },
                      {
                        type: 'text',
                        text: info.payex,
                        color: '#777777',
                        margin: 'md',
                        wrap: true
                      }
                    ],
                    margin: 'sm',
                    maxHeight: '300px',
                    paddingAll: '6px'
                  }
                ],
                flex: 0
              },
              size: 'kilo'
            }
          }
          event.reply([messages, location])
          return
        }
      }
      event.reply('找不到')
    } catch (error) {
      console.log(error)
      event.reply('發生錯誤')
    }
  }
})

bot.listen('/', process.env.PORT || 3000, () => {
  console.log('機器人已啟動')
})
