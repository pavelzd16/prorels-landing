'use client';

import { useId, useRef, useState, type FormEvent } from 'react';
import { leadLimits, leadRecipient, utmKeys, validateLead, type LeadErrors } from '@/lib/lead-contract';
import { FORM_GOAL, metrikaReachGoal } from '@/lib/metrika';
import { Icon } from './icons';

export function ContactForm({ sourcePath = '/', dark = false }: { sourcePath?: string; dark?: boolean }) {
  const prefix = useId();
  const form = useRef<HTMLFormElement>(null);
  const status = useRef<HTMLDivElement>(null);
  const inFlight = useRef(false);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [result, setResult] = useState<{ ok: boolean; message: string; id?: string }>();
  const id = (name: string) => `${prefix}-${name}`;

  function showErrors(next: LeadErrors) {
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) requestAnimationFrame(() => (form.current?.elements.namedItem(first) as HTMLInputElement | undefined)?.focus());
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const values = new FormData(event.currentTarget);
    const search = new URLSearchParams(window.location.search);
    const payload = {
      email: values.get('email'), phone: values.get('phone'), comment: values.get('comment'),
      consent: values.get('consent') === 'on', website: values.get('website'), sourcePath,
      utm: Object.fromEntries(utmKeys.map(key => [key, search.get(key) ?? ''])),
    };
    setResult(undefined);
    const validation = validateLead(payload);
    if (!validation.data || validation.spam) { showErrors(validation.errors); return; }
    setErrors({});
    inFlight.current = true;
    setPending(true);
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(45000) });
      const body = await response.json();
      if (!response.ok) {
        if (body.errors) showErrors(body.errors);
        setResult({ ok: false, message: body.message || 'Не удалось отправить заявку. Попробуйте ещё раз.' });
      } else {
        form.current?.reset();
        setResult({ ok: true, message: body.message, id: body.id });
        metrikaReachGoal(FORM_GOAL);
        requestAnimationFrame(() => status.current?.focus());
      }
    } catch {
      setResult({ ok: false, message: 'Не удалось получить подтверждение отправки. Проверьте соединение или свяжитесь с нами по почте.' });
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  return <form ref={form} className={`contact-form${dark ? ' contact-form-dark' : ''}`} onSubmit={submit} noValidate aria-label="Заявка на поставку" aria-busy={pending}>
    <div className="contact-form-fields">
      <div className="form-field">
        <label htmlFor={id('email')}>Электронная почта <span aria-hidden="true">*</span></label>
        <input id={id('email')} type="email" name="email" autoComplete="email" placeholder="name@company.ru" maxLength={leadLimits.email} required aria-invalid={!!errors.email} aria-describedby={errors.email ? id('email-error') : undefined} />
        {errors.email && <p className="field-error" id={id('email-error')}>{errors.email}</p>}
      </div>
      <div className="form-field">
        <label htmlFor={id('phone')}>Телефон <span aria-hidden="true">*</span></label>
        <input id={id('phone')} type="tel" name="phone" autoComplete="tel" placeholder="+7 (___) ___-__-__" maxLength={leadLimits.phone} required aria-invalid={!!errors.phone} aria-describedby={errors.phone ? id('phone-error') : undefined} />
        {errors.phone && <p className="field-error" id={id('phone-error')}>{errors.phone}</p>}
      </div>
      <div className="form-field">
        <label htmlFor={id('comment')}>Комментарий <span aria-hidden="true">*</span></label>
        <textarea id={id('comment')} name="comment" rows={4} placeholder="Какие материалы нужны, количество и город доставки" minLength={5} maxLength={leadLimits.comment} required aria-invalid={!!errors.comment} aria-describedby={errors.comment ? id('comment-error') : undefined} />
        {errors.comment && <p className="field-error" id={id('comment-error')}>{errors.comment}</p>}
      </div>
    </div>
    <div className="form-trap" aria-hidden="true"><label htmlFor={id('website')}>Ваш сайт</label><input id={id('website')} name="website" type="text" tabIndex={-1} autoComplete="off" /></div>
    <div className="form-consent">
      <input id={id('consent')} type="checkbox" name="consent" required aria-invalid={!!errors.consent} aria-describedby={errors.consent ? id('consent-error') : undefined} />
      <label htmlFor={id('consent')}>Согласен на обработку данных для ответа на заявку согласно <a href="https://prorelsa.ru/privacy" target="_blank" rel="noopener noreferrer">политике конфиденциальности<span className="sr-only"> (откроется в новой вкладке)</span></a>.</label>
    </div>
    {errors.consent && <p className="field-error" id={id('consent-error')}>{errors.consent}</p>}
    <button className="button button-orange form-submit" type="submit" disabled={pending}>{pending ? 'Отправляем заявку…' : 'Получить расчёт'}<Icon name="arrow" /></button>
    <div className={`form-result${result ? result.ok ? ' is-success' : ' is-error' : ''}`} ref={status} tabIndex={-1} role="status" aria-live="polite" aria-atomic="true">
      {result && <><strong>{result.ok ? 'Спасибо за заявку' : 'Заявка не отправлена'}</strong><p>{result.message}</p>{result.id && <span>Номер заявки: {result.id}</span>}</>}
    </div>
    <p className="form-direct">Спецификацию файлом можно отправить на <a href={`mailto:${leadRecipient}`}>{leadRecipient}</a>.</p>
    <noscript><p className="form-direct">Для формы нужен JavaScript. Отправьте заявку на <a href={`mailto:${leadRecipient}`}>{leadRecipient}</a>.</p></noscript>
  </form>;
}
