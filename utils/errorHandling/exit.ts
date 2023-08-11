import log from '../log';

interface LogError { label: string; message: string };

export default ({ label, message }:LogError):void => {
  log.error({ label, message });
  process.exit(1);
};
