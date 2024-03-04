import { Context, Schema, Service, h } from 'koishi'
import { } from 'koishi-plugin-jieba'


declare module 'koishi' {
  interface Context {
    yinglish: Yinglish
  }
}

export class Yinglish extends Service {
  lewdnessLevel: number
  constructor(ctx: Context, config: Yinglish.Config) {
    super(ctx, 'yinglish', true)
    this.lewdnessLevel = config.lewdnessLevel
    ctx
      .command('yinglish <text>')
      .option('lewdness', '-l <lewdness>')
      .action(async ({ options }, input) => {
        return h.text(this.chs2yin(input, options.lewdness))
      })
  }

  _converter(x: string, y: string, lewdness: number): string {
    if (Math.random() > lewdness) return x
    if (x === '，' || x === '。') return '……'
    if (x === '!' || x === '！') return '❤'
    if (x.length > 1 && Math.random() < lewdness) return `${x[0]}……${x}`
    else if (y === 'n' && Math.random() < lewdness) x = '〇'.repeat(x.length)
    return `……${x}`
  }

  chs2yin(text: string, lewdness: number = this.lewdnessLevel) {
    if (!text || lewdness === 0) return ''
    return this.ctx.jieba.tag(text).map(({ word, tag }) => this._converter(word, tag, lewdness)).join('')
  }
}

export namespace Yinglish {
  export const inject = ['jieba'] as const
  export interface Config { lewdnessLevel: number }
  export const Config: Schema<Config> = Schema.object({
    lewdnessLevel: Schema.number().max(1).min(0).default(0.5).description('默认的淫乱程度').role('slider')
  })
}

export default Yinglish