import { Link } from 'react-router-dom'
import styles from '../styles/landing.module.css'

export const Landing = () => {
  return (
    <div className={`row ${styles.landingContainer}`}>
      <div className={`col-12 ${styles.landingBanner} dim`}>
        <img
          src="https://www.bancoagrario.gov.co/images/ig2015/logo-banco-agrario-colombia.png"
          alt="Logo Banco Agrario" className={styles.bankLogo}
        />
        <Link to="/login">
          <button class="btn btn-success my-2 my-sm-0" type="submit">
            Ingresar
          </button>
        </Link>
      </div>
    </div>
  )
}