/**
 * Reconstrói polls-data.{en,es}.json depois da correção do campo `value`.
 * Mapa VAZIO de propósito: nenhuma string mudou, só números, e números vêm da
 * estrutura do pt-BR. Toda a prosa é reaproveitada da memória por texto de origem.
 */
import { construir } from '../build-locale-json'

construir('polls-data', 'en', {})
construir('polls-data', 'es', {})
