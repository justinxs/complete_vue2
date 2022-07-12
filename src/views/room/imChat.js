import IM from '@/utils/im';
/**
 * 共享同一个实例，退出房间需要 destroy 断开im并清空数据
 * 进入房间 init 初始化im
 */
export default new IM();
