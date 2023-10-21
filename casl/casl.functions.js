/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
const { createMongoAbility } = require('@casl/ability');
const caslEnum = require('./casl.enum');
const caslFields = require('./casl.fields');
const userAbilityService = require('../services/user-ability.service');

class CaslFunctions {
  static async getStatementsByUser(user) {
    const userId = user._id;

    const { userAbility } = await userAbilityService.findOne({ userId });

    if (!userAbility || !userAbility.statements.length) {
      return [];
    }

    let { statements } = userAbility;

    statements = JSON.stringify(statements);
    statements = statements.replaceAll('$userId', userId);
    statements = JSON.parse(statements);

    for (const statement of statements) {
      if (
        statement.fields &&
        Array.isArray(statement.fields) &&
        statement.fields.length
      ) {
        continue;
      }

      statement.fields = [];

      for (const subject of statement.subject) {
        if (subject === caslEnum.subjects.all) {
          statement.fields = [
            ...(statement.fields || []),
            ...Object.values(caslFields)
              .map((fields) => fields.join(','))
              .join(',')
              .split(','),
          ];
          continue;
        }

        const subjectFields = caslFields[subject] || [];
        if (
          statement.excludeFields &&
          Array.isArray(statement.excludeFields) &&
          statement.excludeFields.length
        ) {
          const filteredFields = subjectFields.filter(
            (field) =>
              !statement.excludeFields.includes(field) &&
              !statement.fields.includes(field),
          );
          statement.fields = [...(statement.fields || []), ...filteredFields];
        } else {
          statement.fields = [...(statement.fields || []), ...subjectFields];
        }
      }

      if (!statement.fields.length) delete statement.fields;
    }

    return statements;
  }

  static async defineUserAbility(user) {
    if (!user) return null;

    const statements = await this.getStatementsByUser(user);

    const ability = createMongoAbility(statements);

    return ability;
  }

  static async hasRequiredAbilities(ability, requiredAbilities) {
    if (!ability || !requiredAbilities) return false;

    if (!Array.isArray(requiredAbilities)) return false;

    if (!requiredAbilities.length) return false;

    const canManageAll = ability.can(
      caslEnum.actions.manage,
      caslEnum.subjects.all,
    );

    if (canManageAll) {
      return true;
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const requiredAbility of requiredAbilities) {
      if (!requiredAbility.action || !requiredAbility.subject) {
        throw Error('requiredAbility malformed!');
      }

      let canPerformAction = false;
      if (requiredAbility.field) {
        canPerformAction = ability.can(
          requiredAbility.action,
          requiredAbility.subject,
          requiredAbility.field,
        );
      } else {
        canPerformAction = ability.can(
          requiredAbility.action,
          requiredAbility.subject,
        );
      }

      if (!canPerformAction) {
        return false;
      }
    }

    return true;
  }
}

module.exports = CaslFunctions;
