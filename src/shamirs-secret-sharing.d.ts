declare module 'shamirs-secret-sharing' {
    import { Buffer } from 'buffer';
    interface SSS {
        split(secret: Buffer, options: { shares: number; threshold: number }): Buffer[];
        combine(shares: Buffer[]): Buffer;
    }
    const sss: SSS;
    export default sss;
}
