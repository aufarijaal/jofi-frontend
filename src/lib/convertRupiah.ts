// @ts-nocheck
import toRupiah from '@develoka/angka-rupiah-js'

type Options = {
  /**
   * Simbol mata uang yang digunakan. Tersedia `Rp` dan `IDR`. Gunakan `null` untuk menghilangkan simbol.
   * default: `Rp`
   */
  symbol?: string
  /**
   * Menentukan posisi simbol mata uang, di depan atau di belakang nominal menurut kaidah Bahasa Indonesia.
   * default: `true`
   */
  formal?: boolean
  /**
   * Simbol pengganti tanda titik "." pada hasil format
   * defa: to `.`
   */
  dot?: string
  /**
   * Simbol pengganti tanda koma "," pada hasil format
   * defa: to `,`
   */
  decimal?: string
  /**
   * Menentukan jumlah angka di belakang koma
   * default: `2`
   */
  floatingPoint?: number
  /**
   * Opsi untuk menukar bilangan angka di belakang koma yang berisi nol semua dengan ",-"
   * default: `false`
   */
  replaceZeroDecimals?: boolean
  /**
   * Opsi untuk memasang satuan unit (rb, jt, M, T) untuk angka ribuan, jutaan, sampai triliun
   * default: `false`
   */
  useUnit?: boolean
  /**
   * Opsi untuk mengganti satuan unit ribuan dengan simbol "k"
   * default: `false`
   */
  k?: boolean
  /**
   * Memanjangkan singkatan dari satuan unit kembali ke kata asalnya
   * default: `false`
   */
  longUnit?: boolean
  /**
   * Memberikan jarak satu spasi antara nominal dan unit
   * default: `false`
   */
  spaceBeforeUnit?: boolean
}

type ConvertRupiah = (nominal: number, options?: Options) => string

/**
 * Convert number to Indonesian currency format
 * @param nominal - The nominal number
 * @param options - configuration options
 * @returns The formatted Indonesian currency format `Rp30.000`
 */
const convertRupiah: ConvertRupiah = (nominal, options) =>
  toRupiah(nominal, options)

export default convertRupiah
