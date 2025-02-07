import { app } from 'electron'
import fs from 'fs'
import crypto from 'crypto'

class FileUtils {
  appDataPath = `${app.getPath('appData')}\\HostsEditor`

  /**
   * C:/Windows/system32/drivers/etc/hosts 파일을 읽어온다.
   */
  getOriginHosts() {
    const originPath = 'C:\\Windows\\system32\\drivers\\etc\\hosts'
    const txt = fs.readFileSync(originPath, 'utf-8')
    return { txt, path: originPath }
  }

  /**
   * C:/Windows/system32/drivers/etc/hosts 파일을 appData 경로에 저장한다.
   */
  saveOriginHosts() {
    // appData 경로에 원본 hosts가 없는 경우 저장한다.
    // 원본 hosts 파일명: origin_hosts
    const savePath = `${this.appDataPath}\\origin_hosts`

    // appDataPath에 해당하는 폴더가 있는지 확인하고, 없는 경우 생성
    !fs.existsSync(this.appDataPath) && fs.mkdirSync(this.appDataPath)

    if (!fs.existsSync(savePath)) {
      const { txt } = this.getOriginHosts()
      fs.writeFileSync(savePath, txt, { encoding: 'utf-8' })
    }
  }

  /**
   * appDataPath 폴더에 저장된 파일들을 반환한다.
   */
  getHostsFiles() {
    const files = fs.readdirSync(this.appDataPath)
    return files
  }

  /**
   * C:/Windows/system32/drivers/etc/hosts를 읽어와
   * appDataPath 폴더에 저장된 파일들과 비교하여
   * 현재 사용중인 hosts 파일의 파일명, 경로, 내용을 반환한다.
   */
  getCurrentHosts() {
    const originHosts = this.getOriginHosts()
    const files = this.getHostsFiles()

    // originHosts.txt를 md5로 변환
    const md5OriginHosts = crypto.createHash('md5').update(originHosts.txt).digest('hex')

    const currentHosts = files.find((file) => {
      const txt = fs.readFileSync(`${this.appDataPath}\\${file}`, 'utf-8')
      const md5 = crypto.createHash('md5').update(txt).digest('hex')
      return md5 === md5OriginHosts
    })

    if (!currentHosts) {
      return undefined
    } else {
      const path = `${this.appDataPath}\\${currentHosts}`
      const txt = fs.readFileSync(path, 'utf-8')
      return {
        txt: txt,
        path: path,
        name: currentHosts
      }
    }
  }

  /**
   * appDataPath 폴더에 저장된 hosts 파일을 읽어온다.
   */
  getHosts(name: string) {
    const path = `${this.appDataPath}\\${name}`
    const txt = fs.readFileSync(path, 'utf-8')
    return { txt, path }
  }

  /**
   * appDataPath 폴더에 저장된 hosts 파일을 C:/Windows/system32/drivers/etc/hosts에 덮어쓴다.
   */
  setOriginHosts(name: string) {
    try {
      const originPath = 'C:\\Windows\\system32\\drivers\\etc\\hosts'
      const savePath = `${this.appDataPath}\\${name}`
      const txt = fs.readFileSync(savePath, 'utf-8')
      fs.writeFileSync(originPath, txt, { encoding: 'utf-8' })
      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error
      }
    }
  }

  /**
   * appDataPath 폴더에 저장된 hosts 파일을 삭제한다.
   */
  deleteHosts(name: string) {
    try {
      const path = `${this.appDataPath}\\${name}`
      fs.unlinkSync(path)
      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error
      }
    }
  }

  /**
   * appDataPath 폴더에 신규 hosts 파일을 생성한다.
   */
  createHosts(name: string) {
    try {
      const path = `${this.appDataPath}\\${name}`
      const originHosts = this.getOriginHosts()
      fs.writeFileSync(path, `# ${name}\r\n${originHosts.txt}`, { encoding: 'utf-8' })
      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error
      }
    }
  }

  /**
   * appDataPath 폴더에 저장된 파일을 수정한다.
   */
  editHosts(name: string, txt: string) {
    try {
      const path = `${this.appDataPath}\\${name}`
      fs.writeFileSync(path, txt, { encoding: 'utf-8' })
      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error
      }
    }
  }
}

export const fileUtils = new FileUtils()
