// Type defined by feihua

import { Config } from '@tars/utils'

/** 服务监控 */
export namespace stat {
  export enum Type {
    /** 成功 */
    SUCCESS = 'success',

    /** 失败 */
    ERROR = 'error',

    /** 超时 */
    TIMEOUT = 'timeout'
  }

  export interface ReportHeaders {
    /** 主调模块名 */
    masterName: string,

    /** 被调模块名 */
    slaveName: string,

    /** 被调模块接口名 */
    interfaceName: string,

    /** 主调IP */
    masterIp: string,

    /** 被调IP */
    slaveIp: string,

    /** 被调端口 */
    slavePort: number,

    /** 客户端上报为 true, 服务端上报为 false */
    bFromClient?: boolean,

    /** 返回值, 默认值为 0 */
    returnValue?: number,

    /** 被调 set 名 */
    slaveSetName?: string,

    /** 被调 set 地区名 */
    slaveSetArea?: string,

    /** 被调 set 组名 */
    slaveSetID?: string,

    /** 主调 set 信息 (由 setName.setArea.setID 构成) */
    masterSetInfo?: string,

    /** 主调容器名 */
    masterContainer?: string,

    /** 被调容器名 */
    slaveContainer?: string
  }

  export function init (obj?: string | Config): void
  export function report (headers: ReportHeaders, type: Type, timeout?: number): void
  export function stop (): void
}

/** 工具 */
export namespace finder {
  export interface FindResult {
    /** 查询的IP */
    ip: string,

    /** 查询的端口 */
    port: string,

    /** 模块名 */
    moduleName: string,

    /** 接口 */
    interfaceName: string
  }

  export function init (obj?: string | Config): void
  export function find (ip: string, port: number): FindResult
}

/** 特性监控 */
export namespace property {
  interface ReportObj {
    /** 上报数据 */
    report (value: number): void
  }

  export const POLICY: PolicyType
  export function init (obj?: string | Config): void

  /**
   * 创建一个特性监控上报对象
   * @param name 上报的特性值名
   * @param policies 统计方法类的实例数组 (不能有重复的统计方法)
   */
  export function create (name: string, policies: POLICY.Policy | POLICY.Policy[]): ReportObj
}

/** PP 监控 */
export namespace propertyplus {
  interface ReportObj {
    /** 上报数据 */
    report (keys: string[], values: number[]): void
  }

  export const POLICY: PolicyType
  export function init (obj?: string | Config): void

  export interface PropertyPlusOptions {
    /** 指定上报的日志名前缀， 默认值为： [pp|opp] */
    prefix?: string,

    /** 是否非 TARS 服务上报 (日志名拼装方式不同，没有默认维度值), 默认值为 false */
    notTarsLog?: boolean,

    /** 指定主控路由环境（地址），如通过 TARS 平台启动无需配置， 可选值为：[test|pre|formal] */
    routerEnv?: "test" | "pre" | "formal",

    /** 是否在上报后清理本地缓存以节约内存, 默认值为 false */
    cacheKeyPolicy?: boolean
  }

  /**
   * 创建一个 PP 监控上报对象
   * @param name 上报的特性值名
   * @param policies 统计方法类的实例数组 (不能有重复的统计方法)
   */
  export function create (name: string, policies: POLICY.PolicyConstructor | POLICY.PolicyConstructor[], options?: PropertyPlusOptions): ReportObj
}

/** 统计方法 */
export namespace POLICY {
  export interface Policy {
    readonly name: string
    get (): number
    add (value: number): boolean
  }

  export type PolicyConstructor = new (ranges?: number[])  => Policy

  /** 统计最大值 */
  export const Max: PolicyConstructor

  /** 统计最小值 */
  export const Min: PolicyConstructor

  /** 统计一共有多少个数据 */
  export const Sum: PolicyConstructor

  /** 计算数据的平均值 */
  export const Avg: PolicyConstructor

  /** 将所有数据进行相加 */
  export const Count: PolicyConstructor

  /** 分区间统计 */
  export const Distr: PolicyConstructor
}

type PolicyType = typeof POLICY